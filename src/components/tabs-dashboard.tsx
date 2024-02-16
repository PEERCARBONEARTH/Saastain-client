import React from "react";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import SelectYear from "./select-year-dashboard";

export default function TabsDashboard() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="overview" title="Overview">
        <Card>
          <CardBody>
            <SelectYear />
          </CardBody>
        </Card>

        </Tab>
        <Tab key="projects" title="Projects">
          <Card>
            <CardBody>
              Projects            
            </CardBody>
          </Card>  
        </Tab>
        <Tab key="orders" title="Orders">
          <Card>
            <CardBody>
                Orders            
            </CardBody>
          </Card>  
        </Tab>
      </Tabs>
    </div>  
  );
}
