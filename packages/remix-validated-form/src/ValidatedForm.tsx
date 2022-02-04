import {
  Form as RemixForm,
  useActionData,
  useFetcher,
  useFormAction,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { Fetcher } from "@remix-run/react/transition";
import uniq from "lodash/uniq";
import React, {
  ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import invariant from "tiny-invariant";
import { FormContext, FormContextValue } from "./internal/formContext";
import { MultiValueMap, useMultiValueMap } from "./internal/MultiValueMap";
import { useSubmitComplete } from "./internal/submissionCallbacks";
import { omit, mergeRefs } from "./internal/util";
import {
  FieldErrors,
  Validator,
  TouchedFields,
  ValidationErrorResponseData,
} from "./validation/types";

export type FormProps<DataType> = {
  /**
   * A `Validator` object that describes how to validate the form.
   */
  validator: Validator<DataType>;
  /**
   * A submit callback that gets called when the form is submitted
   * after all validations have been run.
   */
  onSubmit?: (
    data: DataType,
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
  /**
   * Allows you to provide a `fetcher` from remix's `useFetcher` hook.
   * The form will use the fetcher for loading states, action data, etc
   * instead of the default form action.
   */
  fetcher?: ReturnType<typeof useFetcher>;
  /**
   * Accepts an object of default values for the form
   * that will automatically be propagated to the form fields via `useField`.
   */
  defaultValues?: Partial<DataType>;
  /**
   * A ref to the form element.
   */
  formRef?: React.RefObject<HTMLFormElement>;
  /**
   * An optional sub-action to use for the form.
   * Setting a value here will cause the form to be submitted with an extra `subaction` value.
   * This can be useful when there are multiple forms on the screen handled by the same action.
   */
  subaction?: string;
  /**
   * Reset the form to the default values after the form has been successfully submitted.
   * This is useful if you want to submit the same form multiple times,
   * and don't redirect in-between submissions.
   */
  resetAfterSubmit?: boolean;
  /**
   * Normally, the first invalid input will be focused when the validation fails on form submit.
   * Set this to `false` to disable this behavior.
   */
  disableFocusOnError?: boolean;
} & Omit<ComponentProps<typeof RemixForm>, "onSubmit">;

function useErrorResponseForThisForm(
  fetcher?: ReturnType<typeof useFetcher>,
  subaction?: string
): ValidationErrorResponseData | null {
  const actionData = useActionData<any>();
  if (fetcher) {
    if ((fetcher.data as any)?.fieldErrors) return fetcher.data as any;
    return null;
  }

  if (!actionData?.fieldErrors) return null;
  if (
    (!subaction && !actionData.subaction) ||
    actionData.subaction === subaction
  )
    return actionData;
  return null;
}

function useFieldErrors(
  fieldErrorsFromBackend?: FieldErrors
): [FieldErrors, React.Dispatch<React.SetStateAction<FieldErrors>>] {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(
    fieldErrorsFromBackend ?? {}
  );
  useEffect(() => {
    if (fieldErrorsFromBackend) setFieldErrors(fieldErrorsFromBackend);
  }, [fieldErrorsFromBackend]);

  return [fieldErrors, setFieldErrors];
}

const useIsSubmitting = (
  fetcher?: Fetcher
): [boolean, () => void, () => void] => {
  const [isSubmitStarted, setSubmitStarted] = useState(false);
  const transition = useTransition();
  const hasActiveSubmission = fetcher
    ? fetcher.state === "submitting"
    : !!transition.submission;
  const isSubmitting = hasActiveSubmission && isSubmitStarted;

  const startSubmit = () => setSubmitStarted(true);
  const endSubmit = () => setSubmitStarted(false);

  return [isSubmitting, startSubmit, endSubmit];
};

const getDataFromForm = (el: HTMLFormElement) => new FormData(el);

/**
 * The purpose for this logic is to handle validation errors when javascript is disabled.
 * Normally (without js), when a form is submitted and the action returns the validation errors,
 * the form will be reset. The errors will be displayed on the correct fields,
 * but all the values in the form will be gone. This is not good UX.
 *
 * To get around this, we return the submitted form data from the server,
 * and use those to populate the form via `defaultValues`.
 * This results in a more seamless UX akin to what you would see when js is enabled.
 *
 * One potential downside is that resetting the form will reset the form
 * to the _new_ default values that were returned from the server with the validation errors.
 * However, this case is less of a problem than the janky UX caused by losing the form values.
 * It will only ever be a problem if the form includes a `<button type="reset" />`
 * and only if JS is disabled.
 */
function useDefaultValues<DataType>(
  repopulateFieldsFromBackend?: any,
  defaultValues?: Partial<DataType>
) {
  return repopulateFieldsFromBackend ?? defaultValues;
}

function nonNull<T>(value: T | null | undefined): value is T {
  return value !== null;
}

const focusFirstInvalidInput = (
  fieldErrors: FieldErrors,
  customFocusHandlers: MultiValueMap<string, () => void>,
  formElement: HTMLFormElement
) => {
  const namesInOrder = [...formElement.elements]
    .map((el) => {
      const input = el instanceof RadioNodeList ? el[0] : el;
      if (input instanceof HTMLInputElement) return input.name;
      return null;
    })
    .filter(nonNull)
    .filter((name) => name in fieldErrors);
  const uniqueNamesInOrder = uniq(namesInOrder);

  for (const fieldName of uniqueNamesInOrder) {
    if (customFocusHandlers.has(fieldName)) {
      customFocusHandlers.getAll(fieldName).forEach((handler) => {
        handler();
      });
      break;
    }

    const elem = formElement.elements.namedItem(fieldName);
    if (!elem) continue;

    if (elem instanceof RadioNodeList) {
      const selectedRadio =
        [...elem]
          .filter(
            (item): item is HTMLInputElement => item instanceof HTMLInputElement
          )
          .find((item) => item.value === elem.value) ?? elem[0];
      if (selectedRadio && selectedRadio instanceof HTMLInputElement) {
        selectedRadio.focus();
        break;
      }
    }

    if (elem instanceof HTMLInputElement) {
      if (elem.type === "hidden") {
        continue;
      }

      elem.focus();
      break;
    }
  }
};

/**
 * The primary form component of `remix-validated-form`.
 */
export function ValidatedForm<DataType>({
  validator,
  onSubmit,
  children,
  fetcher,
  action,
  defaultValues,
  formRef: formRefProp,
  onReset,
  subaction,
  resetAfterSubmit,
  disableFocusOnError,
  method,
  replace,
  ...rest
}: FormProps<DataType>) {
  const backendError = useErrorResponseForThisForm(fetcher, subaction);
  const [fieldErrors, setFieldErrors] = useFieldErrors(
    backendError?.fieldErrors
  );
  const [isSubmitting, startSubmit, endSubmit] = useIsSubmitting(fetcher);

  const defaultsToUse = useDefaultValues(
    backendError?.repopulateFields,
    defaultValues
  );
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  useSubmitComplete(isSubmitting, () => {
    endSubmit();
    if (!backendError && resetAfterSubmit) {
      formRef.current?.reset();
    }
  });
  const customFocusHandlers = useMultiValueMap<string, () => void>();

  const contextValue = useMemo<FormContextValue>(
    () => ({
      fieldErrors,
      action,
      defaultValues: defaultsToUse,
      isSubmitting,
      isValid: Object.keys(fieldErrors).length === 0,
      touchedFields,
      setFieldTouched: (fieldName: string, touched: boolean) =>
        setTouchedFields((prev) => ({
          ...prev,
          [fieldName]: touched,
        })),
      clearError: (fieldName) => {
        setFieldErrors((prev) => omit(prev, fieldName));
      },
      validateField: async (fieldName) => {
        invariant(formRef.current, "Cannot find reference to form");
        const { error } = await validator.validateField(
          getDataFromForm(formRef.current),
          fieldName as any
        );

        // By checking and returning `prev` here, we can avoid a re-render
        // if the validation state is the same.
        if (error) {
          setFieldErrors((prev) => {
            if (prev[fieldName] === error) return prev;
            return {
              ...prev,
              [fieldName]: error,
            };
          });
          return error;
        } else {
          setFieldErrors((prev) => {
            if (!(fieldName in prev)) return prev;
            return omit(prev, fieldName);
          });
          return null;
        }
      },
      registerReceiveFocus: (fieldName, handler) => {
        customFocusHandlers().add(fieldName, handler);
        return () => {
          customFocusHandlers().remove(fieldName, handler);
        };
      },
      hasBeenSubmitted,
    }),
    [
      fieldErrors,
      action,
      defaultsToUse,
      isSubmitting,
      touchedFields,
      hasBeenSubmitted,
      setFieldErrors,
      validator,
      customFocusHandlers,
    ]
  );

  const Form = fetcher?.Form ?? RemixForm;

  let clickedButtonRef = React.useRef<any>();
  useEffect(() => {
    let form = formRef.current;
    if (!form) return;

    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      let submitButton = event.target.closest<
        HTMLButtonElement | HTMLInputElement
      >("button,input[type=submit]");

      if (
        submitButton &&
        submitButton.form === form &&
        submitButton.type === "submit"
      ) {
        clickedButtonRef.current = submitButton;
      }
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <Form
      ref={mergeRefs([formRef, formRefProp])}
      {...rest}
      action={action}
      method={method}
      replace={replace}
      onSubmit={async (e) => {
        e.preventDefault();
        setHasBeenSubmitted(true);
        startSubmit();
        const result = await validator.validate(
          getDataFromForm(e.currentTarget)
        );
        if (result.error) {
          endSubmit();
          setFieldErrors(result.error.fieldErrors);
          if (!disableFocusOnError) {
            focusFirstInvalidInput(
              result.error.fieldErrors,
              customFocusHandlers(),
              formRef.current!
            );
          }
        } else {
          onSubmit && onSubmit(result.data, e);
          if (fetcher)
            fetcher.submit(clickedButtonRef.current || e.currentTarget);
          else
            submit(clickedButtonRef.current || e.currentTarget, {
              method,
              replace,
            });
          clickedButtonRef.current = null;
        }
      }}
      onReset={(event) => {
        onReset?.(event);
        if (event.defaultPrevented) return;
        setFieldErrors({});
        setTouchedFields({});
        setHasBeenSubmitted(false);
      }}
    >
      <FormContext.Provider value={contextValue}>
        {subaction && (
          <input type="hidden" value={subaction} name="subaction" />
        )}
        {children}
      </FormContext.Provider>
    </Form>
  );
}
