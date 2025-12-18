import AllocateRowChef from "../components/AllocateRowChef";
import ChefLabourTable from "../components/ChefLabourTable";

export default function ChefLabourSection({ data }) {
  return (
    <>
      <AllocateRowChef onAllocate={(type) => setAllocationType(type)} />
      <ChefLabourTable />
    </>
  );
}
