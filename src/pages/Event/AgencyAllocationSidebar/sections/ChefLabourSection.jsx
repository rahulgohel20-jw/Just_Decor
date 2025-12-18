import { useState } from "react";
import AllocateRowChef from "../components/AllocateRowChef";
import ChefLabourTable from "../components/ChefLabourTable";
import ChefLabourPlateTable from "../components/ChefLabourPlateTable";

export default function ChefLabourSection({ data }) {
  const [allocationType, setAllocationType] = useState(null);

  return (
    <>
      <AllocateRowChef onAllocate={(type) => setAllocationType(type)} />

      {allocationType === "counter" && <ChefLabourTable />}

      {allocationType === "plate" && <ChefLabourPlateTable />}
    </>
  );
}
