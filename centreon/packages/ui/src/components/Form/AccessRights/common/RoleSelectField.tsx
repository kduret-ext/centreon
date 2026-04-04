import type { SelectChangeEvent } from '@mui/material';

import SelectField, { type SelectEntry } from '../../../../InputField/Select';
import { useRoleSelectField } from './RoleSelectField.styles';

interface Props {
  disabled?: boolean;
  label?: string;
  onChange: (newValue: string) => void;
  roles: Array<SelectEntry>;
  testId: string;
  value: string;
}

const RoleSelectField = ({
  roles,
  value,
  onChange,
  testId,
  label,
  disabled
}: Props): JSX.Element => {
  const { classes } = useRoleSelectField();
  const change = (event: SelectChangeEvent): void => {
    onChange(event.target.value as string);
  };

  return (
    <div className={classes.roleContainer}>
      <SelectField
        dataTestId={testId}
        disabled={disabled}
        formControlProps={{}}
        fullWidth
        label={label}
        onChange={
          // biome-ignore lint/suspicious/noExplicitAny: complex MUI SelectProps intersection type
          change as any
        }
        options={roles}
        selectedOptionId={value}
        size="small"
      />
    </div>
  );
};

export default RoleSelectField;
