import { Button, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Glider, Site } from '../../lib/types'
import { FC } from 'react'
import { FlightInputs } from '../../lib/types'
import WindInput from '../WindInput'

interface IProps {
  sites: Site[]
  gliders: Glider[]
  onSubmit: SubmitHandler<FlightInputs>
}

const yupSchema = yup.object({
  date: yup.date().required(),
  site_id: yup.number().required(),
  glider_id: yup.number().required(),

  /*
    The start_time and stop_time are really hacky, unfortunately I could not find a cleaner
    implementation. The time input field provides a string in the format of "14:56", this is
    combined with the value from the date field.
  */
  start_time: yup.date().when(['date'], (date, schema) => {
    return schema.transform((_, val) => {
      return new Date(Date.parse(`${date[0].toDateString()} ${val}`))
    })
  }).required(),
  stop_time: yup.date().when(['date'], (date, schema) => {
    return schema.transform((_, val) => {
      return new Date(Date.parse(`${date[0].toDateString()} ${val}`))
    })
  }).required(),

  max_altitude: yup.number().positive(),
  wind_speed: yup.number().positive(),
  wind_dir: yup.number().min(0).max(360),
  comments: yup.string().required(),
  igc_file: yup.mixed<File>()
})

const FlightForm: FC<IProps> = ({ sites, gliders, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(yupSchema)
  })

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="m-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          {...register('date', { required: true })}
          type="date"
          isInvalid={!!errors.date}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Site</Form.Label>
        <Form.Select {...register('site_id', { required: true })}>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Glider</Form.Label>
        <Form.Select {...register('glider_id', { required: true })}>
          {gliders.map((glider) => (
            <option key={glider.id} value={glider.id}>
              {glider.manufacturer} - {glider.model}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Start Time</Form.Label>
        <Form.Control
          {...register('start_time', { required: true })}
          type="time"
          isInvalid={!!errors.start_time}
        />
        {errors.start_time?.message}
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Stop Time</Form.Label>
        <Form.Control
          {...register('stop_time', { required: true })}
          type="time"
          isInvalid={!!errors.stop_time}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Maximum Altitude</Form.Label>
        <Form.Control
          {...register('max_altitude', { required: true })}
          type="number"
          isInvalid={!!errors.max_altitude}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Wind Speed</Form.Label>
        <Form.Control
          {...register('wind_speed', { required: true })}
          type="number"
          isInvalid={!!errors.wind_speed}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Wind Direction</Form.Label>
        <WindInput
          onChange={(e) => {
            setValue('wind_dir', parseInt(e.target.value))
          }}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Comments</Form.Label>
        <Form.Control
          {...register('comments')}
          as="textarea"
          rows={3}
          isInvalid={!!errors.comments}
        />
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>IGC File</Form.Label>
        <Form.Control
          type="file"
          {...register('igc_file')}
          isInvalid={!!errors.igc_file}
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
