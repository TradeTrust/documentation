type GaAction = "feedback_yes" | "feedback_no";
type GaCategory = "feedback";

interface GaEventProps {
  action: GaAction;
  category: GaCategory;
  label?: string;
  value?: number;
}

export const validateGaEvent = (event: GaEventProps): void => {
  const { action, category, label, value } = event;
  if (!category) console.error("Category is required");
  if (!action) console.error("Action is required");
  if (label && typeof label !== "string") console.error("Label must be a string");
  if (value && typeof value !== "number") console.error("Value must be a number");
};

export const gaEvent = (event: GaEventProps): void => {
  validateGaEvent(event);
  const { action, category, label, value } = event;

  // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
  // This plugin is always inactive in development and only active in production to avoid polluting the analytics statistics.
  // simple check for gtag, allow local development to "pass" through
  if (typeof gtag === "function") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
