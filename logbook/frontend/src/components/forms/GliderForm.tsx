import { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  manufacturer: string
  model: string
  rating: string
}

interface IProps {
  onSubmit: SubmitHandler<Inputs>
}

const FlightForm: FC<IProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>()

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <Form.Group className="m-3">
        <Form.Label>Manufacturer</Form.Label>
        <Form.Control
          {...register('manufacturer', { required: true })}
          type="text"
          isInvalid={!!errors.manufacturer}
        />
        <Form.Control.Feedback type="invalid">
          {errors.manufacturer?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Model</Form.Label>
        <Form.Control
          {...register('model', { required: true })}
          type="text"
          isInvalid={!!errors.model}
        />
        <Form.Control.Feedback type="invalid">
          {errors.model?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Rating</Form.Label>
        <Form.Select {...register('rating', { required: true })}>
          <option value="EN-A">EN-A</option>
          <option value="EN-B">EN-B</option>
          <option value="EN-C">EN-C</option>
          <option value="EN-D">EN-D</option>
          <option value="unrated">Unrated</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
      <br />
    </Form>
  )
}

export default FlightForm
