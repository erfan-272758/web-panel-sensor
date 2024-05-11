import * as React from "react";
import {
  AutocompleteInput,
  DateInput,
  ReferenceInput,
  SearchInput,
  SelectInput,
} from "react-admin";
import { Customer } from "../types";

const UserFilters = [<SearchInput source="q" alwaysOn />];

export default UserFilters;
