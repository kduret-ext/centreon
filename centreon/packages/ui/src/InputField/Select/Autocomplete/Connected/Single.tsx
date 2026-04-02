import AutocompleteField from '..';
import type { ReactElement } from 'react';
import ConnectedAutocompleteField from '.';

const SingleConnectedAutocompleteField = ConnectedAutocompleteField(
  AutocompleteField as unknown as (props: unknown) => ReactElement,
  false
);

export default SingleConnectedAutocompleteField;
