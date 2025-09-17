// src/components/Breadcrumbs.js
import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

const Breadcrumbs = ({ title, breadcrumbItem }) => {
  return (
    <div className="mb-3">
      <Breadcrumb>
        <BreadcrumbItem active>{title}</BreadcrumbItem>
        <BreadcrumbItem active>{breadcrumbItem}</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
