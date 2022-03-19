import { useForm } from 'react-hook-form';
import { MainInput } from '../components/Inputs/MainInput';
import { MainSelect } from '../components/Inputs/MainSelect';
import { MainTextArea } from '../components/Inputs/MainTextArea';

const AddOrEditCardModal = ({setShowAddCardModal, addOrEditCard, currentColumns, columnId, cardToEdit, setCardToEdit}) => {
  const isNew = cardToEdit.id ? false : true;
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
        columnSelect: isNew ? '' : cardToEdit.columnId,
        cardTitle: isNew ? '' : cardToEdit.cardTitle,
        cardDescription: isNew ? '' : cardToEdit.cardDescription,
        cardStatus: isNew ? 'open' : cardToEdit.cardStatus,
      }
    }
  );

  const onSubmit = handleSubmit(({columnSelect, cardTitle, cardDescription, cardStatus}) => {
    const cardObject = {
      cardTitle: cardTitle,
      cardDescription: cardDescription,
      cardStatus: cardStatus,
      cardCreatedDate: new Date(),
    };

    addOrEditCard(columnSelect, cardObject, isNew, cardToEdit.cardIndex, cardToEdit.columnId);
  });

  const columnSelect = register('columnSelect', { required: true });
  const cardTitle = register('cardTitle', { required: true });
  const cardDescription = register('cardDescription', { required: true });
  const cardStatus = register('cardStatus');

  return (
    <div className='modal add-item-modal'>
      <div className="close" onClick={() => {setCardToEdit({}); setShowAddCardModal(false)}}>Close</div>
      <form className={'form-container'} onSubmit={onSubmit} noValidate>
        <MainSelect
          isRequired={true}
          inputValue={getValues('columnSelect')}
          options={currentColumns}
          inputLabel={'Select a column'}
          onChange={(e) => {
            setValue('columnSelect', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            columnSelect.onChange(e);
          }}
          errorType={errors.columnSelect?.type}
          hidePlaceholderOption={false}
        />
        <MainInput
          className={errors.cardTitle ? 'error' : ''}
          inputType={'text'}
          inputLabel={'Card Title'}
          isRequired={true}
          inputValue={getValues('cardTitle')}
          onChange={(e) => {
            setValue('cardTitle', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            cardTitle.onChange(e);
          }}
          errorType={errors.cardTitle?.type}
          autoFocus={true}
        />
        <MainTextArea
          className={errors.cardDescription ? 'error' : ''}
          inputType={'text'}
          inputLabel={'Card Description'}
          isRequired={true}
          inputValue={getValues('cardDescription')}
          onChange={(e) => {
            setValue('cardDescription', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            cardDescription.onChange(e);
          }}
          errorType={errors.cardDescription?.type}
        />
        <MainSelect
          isRequired={true}
          inputValue={getValues('cardStatus')}
          options={[{ id: 'open', name: 'open' }, { id: 'closed', name: 'closed' }]}
          inputLabel={'Change Status'}
          onChange={(e) => {
            setValue('cardStatus', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            cardStatus.onChange(e);
          }}
          errorType={errors.cardStatus?.type}
          hidePlaceholderOption={true}
        />
        <button
          type='submit'
        >{isNew ? 'Create Card' : 'Edit Card'}</button>
      </form>
    </div>
  )
}

export default AddOrEditCardModal;