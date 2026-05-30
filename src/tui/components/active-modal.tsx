import { useStore } from "../state/store.tsx";
import { DeleteModal } from "./delete-modal.tsx";

/**
 * Routes to the modal component matching the store's `activeModal`, or renders nothing when no
 * modal is active. The host stays thin: each modal owns its own rendering and side-effect wiring.
 */
export function ActiveModal() {
  const { activeModal } = useStore();

  switch (activeModal?.type) {
    case "delete":
      return <DeleteModal />;
    default:
      return null;
  }
}
