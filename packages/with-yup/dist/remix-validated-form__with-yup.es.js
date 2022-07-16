import { createValidator } from "remix-validated-form";
const validationErrorToFieldErrors = (error) => {
  const fieldErrors = {};
  error.inner.forEach((innerError) => {
    if (!innerError.path)
      return;
    fieldErrors[innerError.path] = innerError.message;
  });
  return fieldErrors;
};
const withYup = (validationSchema) => {
  return createValidator({
    validate: async (data) => {
      try {
        const validated = await validationSchema.validate(data, {
          abortEarly: false
        });
        return { data: validated, error: void 0 };
      } catch (err) {
        return {
          error: validationErrorToFieldErrors(err),
          data: void 0
        };
      }
    },
    validateField: async (data, field) => {
      try {
        await validationSchema.validateAt(field, data);
        return {};
      } catch (err) {
        return { error: err.message };
      }
    }
  });
};
export { withYup };
//# sourceMappingURL=remix-validated-form__with-yup.es.js.map
