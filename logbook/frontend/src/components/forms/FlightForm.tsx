import { Button, Form } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Glider, Site } from '../../lib/types'
import { FC } from 'react'
import WindInput from '../WindInput'

type Inputs = {
  date: Date
  site_id: number
  glider_id: number
  start_time: Date
  stop_time: Date
  max_altitude?: number
  wind_speed?: number
  wind_dir?: number
  comments: string
  igc_file?: File
}

interface IProps {
  sites: Site[]
  gliders: Glider[]
  onSubmit: SubmitHandler<Inputs>
}

const FlightForm: FC<IProps> = ({ sites, gliders, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>()

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="m-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          {...register('date', { required: true })}
          type="date"
          isInvalid={!!errors.date}
        />
        <Form.Control.Feedback type="invalid">
          {errors.date?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Site</Form.Label>
        <Form.Select {...register('site_id', { required: true })}>
          {sites.map((site) => (
            <option key={site.id}>{site.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Glider</Form.Label>
        <Form.Select {...register('glider_id', { required: true })}>
          {gliders.map((glider) => (
            <option key={glider.id}>
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
        <Form.Control.Feedback type="invalid">
          {errors.start_time?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Stop Time</Form.Label>
        <Form.Control
          {...register('stop_time', { required: true })}
          type="time"
          isInvalid={!!errors.stop_time}
        />
        <Form.Control.Feedback type="invalid">
          {errors.stop_time?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Maximum Altitude</Form.Label>
        <Form.Control
          {...register('max_altitude', { required: true })}
          type="number"
          isInvalid={!!errors.max_altitude}
        />
        <Form.Control.Feedback type="invalid">
          {errors.max_altitude?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Wind Speed</Form.Label>
        <Form.Control
          {...register('wind_speed', { required: true })}
          type="number"
          isInvalid={!!errors.wind_speed}
        />
        <Form.Control.Feedback type="invalid">
          {errors.wind_speed?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Wind Direction</Form.Label>
        <WindInput
          onChange={(e) => {
            setValue('wind_dir', parseInt(e.target.value))
          }}
        />
        <Form.Control.Feedback type="invalid">
          {errors.wind_dir?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Comments</Form.Label>
        <Form.Control
          {...register('comments')}
          as="textarea"
          rows={3}
          isInvalid={!!errors.comments}
        />
        <Form.Control.Feedback type="invalid">
          {errors.comments?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>IGC File</Form.Label>
        <Form.Control
          type="file"
          {...register('igc_file')}
          isInvalid={!!errors.igc_file}
        />
        <Form.Control.Feedback type="invalid">
          {errors.igc_file?.message}
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
