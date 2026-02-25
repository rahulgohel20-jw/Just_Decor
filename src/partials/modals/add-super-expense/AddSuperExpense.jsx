/**
 * AddSuperExpense.jsx  —  Main entry point
 *
 * Routes to the correct form based on expenseType:
 *   SimpleExpenseForm  →  employees | office | serve
 *   ComplexExpenseForm →  trip      | other
 *
 * Props
 *   isOpen       boolean
 *   onClose      () => void
 *   expenseType  "employees" | "trip" | "office" | "serve" | "other"
 *
 * Note: Due Date visibility is controlled internally by reading
 *       userId from localStorage. Visible only when userId === 1 (superadmin).
 *
 * Usage
 *   <AddSuperExpense
 *     isOpen={isModalOpen}
 *     onClose={() => setIsModalOpen(false)}
 *     expenseType={activeTab}
 *   />
 */

import SimpleExpenseForm from "./Simpleexpenseform";
import ComplexExpenseForm from "./Complexexpenseform";

// Tabs that use the simple form (payment pills + upload + expense date)
const SIMPLE_TYPES = ["employees", "office", "serve"];

const AddSuperExpense = ({ isOpen, onClose, expenseType = "trip" }) => {
  if (SIMPLE_TYPES.includes(expenseType)) {
    return (
      <SimpleExpenseForm
        isOpen={isOpen}
        onClose={onClose}
        expenseType={expenseType}
      />
    );
  }

  // trip | other
  return (
    <ComplexExpenseForm
      isOpen={isOpen}
      onClose={onClose}
      expenseType={expenseType}
    />
  );
};

export default AddSuperExpense;
