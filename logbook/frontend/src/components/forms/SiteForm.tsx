import { FC } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { SiteInputs } from '../../lib/types'

interface IProps {
  onSubmit: SubmitHandler<SiteInputs>
}

const yupSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  latitude: yup.number().min(-90).max(90).required(),
  longitude: yup.number().min(-180).max(180).required(),
  altitude: yup.number().min(0).required(),
  country: yup.string().required()
})

const FlightForm: FC<IProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(yupSchema)
  })

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)} noValidate>
      <Form.Group className="m-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          {...register('name', { required: true })}
          type="text"
          isInvalid={!!errors.name}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Country</Form.Label>
        <Form.Control
          {...register('country', { required: true })}
          type="text"
          isInvalid={!!errors.country}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          {...register('latitude', { required: true, min: -90, max: 90 })}
          type="number"
          isInvalid={!!errors.latitude}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Longitude</Form.Label>
        <Form.Control
          {...register('longitude', { required: true, min: -180, max: 180 })}
          type="number"
          isInvalid={!!errors.longitude}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Altitude</Form.Label>
        <Form.Control
          {...register('altitude', { required: true, min: 0 })}
          type="numer"
          isInvalid={!!errors.altitude}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          {...register('description')}
          as="textarea"
          rows={3}
          isInvalid={!!errors.description}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        Submit
      </Button>
      <br />
    </Form>
  )
}

export default FlightForm
