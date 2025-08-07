import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
// import GrossaryItems from "@components/event/grossary_items/GrossaryItems";
import GrossaryItems from "./grossary_items/GrossaryItems";
import useStyles from "./style";

const RawMaterialAllocationPage = () => {
  const classes = useStyles();

  const tabs = [
    {
      value: "grossary_items",
      label: <>Grossary Items</>,
      children: <GrossaryItems />,
    },
    {
      value: "vegetables",
      label: 'Vegetables',
      children: 'Vegetables',
    },
    {
      value: "dairy_items",
      label: 'Dairy Items',
      children: 'Dairy Items',
    },
    {
      value: "ice_department",
      label: 'Ice Department',
      children: 'Ice Department',
    },
    {
      value: "mineral_water",
      label: 'Mineral Water',
      children: 'Mineral Water',
    },
    {
      value: "ready_made_order",
      label: 'Ready Made Order',
      children: 'Ready Made Order',
    },
    {
      value: "gas_batla_item",
      label: 'GAS BATLA ITEM',
      children: 'GAS BATLA ITEM',
    },
    {
      value: "staff_salairy",
      label: 'STAFF SALAIRY',
      children: 'STAFF SALAIRY',
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Raw Material Allocation" }]} />
        </div>
         <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export default RawMaterialAllocationPage;
