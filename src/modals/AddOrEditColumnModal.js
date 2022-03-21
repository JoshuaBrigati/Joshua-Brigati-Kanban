import { useForm } from 'react-hook-form';
import { MainInput } from '../components/Inputs/MainInput';
import { MainTextArea } from '../components/Inputs/MainTextArea';

const AddOrEditColumnModal = ({setShowAddColumnModal, addOrEditColumn, columnToEdit, setColumnToEdit}) => {
  const isNew  = columnToEdit.columnId ? false : true;
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      columnName: isNew ?  '' : `${columnToEdit.columnName}`,
      columnDescription: isNew ? '' : `${columnToEdit.columnDescription}`,
    }
  });
  const onSubmit = handleSubmit(({ columnName, columnDescription }) => {
    addOrEditColumn(columnToEdit.columnId, columnName, columnDescription, isNew);
  });

  const columnName = register('columnName', { required: true });
  const columnDescription = register('columnDescription', { required: true });

  return (
    <div className='modal add-column-modal'>
      <div className="close" onClick={() => {setColumnToEdit({}); setShowAddColumnModal(false)}}>Close</div>
      <form className={'form-container'} onSubmit={onSubmit} noValidate>
        <MainInput
          className={errors.columnName ? 'error' : ''}
          inputType={'text'}
          inputLabel={'Column Name'}
          isRequired={true}
          inputValue={getValues('columnName')}
          onChange={(e) => {
            setValue('columnName', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            columnName.onChange(e);
          }}
          errorType={errors.columnName?.type}
          autoFocus={true}
        />
        <MainTextArea
          className={errors.columnDescription ? 'error' : ''}
          inputType={'text'}
          inputLabel={'Column Description'}
          isRequired={true}
          inputValue={getValues('columnDescription')}
          onChange={(e) => {
            setValue('columnDescription', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            columnDescription.onChange(e);
          }}
          errorType={errors.columnDescription?.type}
        />
        <button
          type='submit'
        >{!isNew ? 'Edit Column' : 'Create Column'}</button>
      </form>
    </div>
  )
}

export default AddOrEditColumnModal;