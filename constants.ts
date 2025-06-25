// This file can be used for application-wide constants.
// For example, API endpoints if not using a service layer abstraction,
// or specific configuration values.

// User roles and interview statuses are defined as enums in types.ts for type safety.
// If you need string array versions for dropdowns, you can define them here or derive them.

export const APP_NAME = "HERE AND NOW AI";

// Example of deriving options for a select dropdown from an enum
// import { UserRole } from './types';
// export const USER_ROLE_OPTIONS = Object.values(UserRole).map(role => ({
//   value: role,
//   label: role,
// }));