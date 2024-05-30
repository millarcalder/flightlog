import { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Inputs {
  name: string
  description: string
  latitude: number
  longitude: number
  altitude: number
  country: string
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
    <Form onSubmit={handleSubmit(props.onSubmit)} noValidate>
      <Form.Group className="m-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          {...register('name', { required: true })}
          type="text"
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Country</Form.Label>
        <Form.Control
          {...register('country', { required: true })}
          type="text"
          isInvalid={!!errors.country}
        />
        <Form.Control.Feedback type="invalid">
          {errors.country?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          {...register('latitude', { required: true, min: -90, max: 90 })}
          type="number"
          isInvalid={!!errors.latitude}
        />
        <Form.Control.Feedback type="invalid">
          {errors.latitude?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Longitude</Form.Label>
        <Form.Control
          {...register('longitude', { required: true, min: -180, max: 180 })}
          type="number"
          isInvalid={!!errors.longitude}
        />
        <Form.Control.Feedback type="invalid">
          {errors.longitude?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Altitude</Form.Label>
        <Form.Control
          {...register('altitude', { required: true, min: 0 })}
          type="numer"
          isInvalid={!!errors.altitude}
        />
        <Form.Control.Feedback type="invalid">
          {errors.altitude?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          {...register('description')}
          as="textarea"
          rows={3}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
      <br />
    </Form>
  )
}

export default FlightForm
