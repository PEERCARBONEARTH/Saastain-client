import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";

export default function DashboardBreadCrumb() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Overview</BreadcrumbItem>
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
    </Breadcrumbs>
  );
}

export function AddDataBreadCrumb() {
    return (
      <Breadcrumbs>
        <BreadcrumbItem>Accounting</BreadcrumbItem>
        <BreadcrumbItem>Add Data</BreadcrumbItem>
      </Breadcrumbs>
    );
  }
  