import { Button, Form, Row, Col } from 'react-bootstrap'
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
  dateOfFlight: yup.date().required(),
  siteId: yup.number().required(),
  gliderId: yup.number().required(),

  /*
    The start_time and stop_time are really hacky, unfortunately I could not find a cleaner
    implementation. The time input field provides a string in the format of "14:56", this is
    combined with the value from the date field.
  */
  startTime: yup
    .date()
    .when(['dateOfFlight'], (dateOfFlight, schema) => {
      return schema.transform((_, val) => {
        return new Date(Date.parse(`${dateOfFlight[0].toDateString()} ${val}`))
      })
    })
    .required(),
  stopTime: yup
    .date()
    .when(['dateOfFlight'], (dateOfFlight, schema) => {
      return schema.transform((_, val) => {
        return new Date(Date.parse(`${dateOfFlight[0].toDateString()} ${val}`))
      })
    })
    .required(),

  maxAltitude: yup.number().positive(),
  windSpeed: yup.number().min(0),
  windDir: yup.number().min(0).max(360),
  comments: yup.string().required(),
  igcFile: yup.mixed<FileList>()
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
        <Form.Label>Site</Form.Label>
        <Form.Select {...register('siteId', { required: true })}>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="m-3">
        <Form.Label>Glider</Form.Label>
        <Form.Select {...register('gliderId', { required: true })}>
          {gliders.map((glider) => (
            <option key={glider.id} value={glider.id}>
              {glider.manufacturer} - {glider.model}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="m-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              {...register('dateOfFlight', { required: true })}
              type="date"
              isInvalid={!!errors.dateOfFlight}
            />
          </Form.Group>

          <Form.Group className="m-3">
            <Form.Label>Wind Direction</Form.Label>
            <br />
            <WindInput
              onChange={(e) => {
                setValue('windDir', parseInt(e.target.value))
              }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="m-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              {...register('startTime', { required: true })}
              type="time"
              isInvalid={!!errors.startTime}
            />
          </Form.Group>

          <Form.Group className="m-3">
            <Form.Label>Stop Time</Form.Label>
            <Form.Control
              {...register('stopTime', { required: true })}
              type="time"
              isInvalid={!!errors.stopTime}
            />
          </Form.Group>

          <Form.Group className="m-3">
            <Form.Label>Maximum Altitude</Form.Label>
            <Form.Control
              {...register('maxAltitude', { required: true })}
              type="number"
              isInvalid={!!errors.maxAltitude}
            />
          </Form.Group>

          <Form.Group className="m-3">
            <Form.Label>Wind Speed</Form.Label>
            <Form.Control
              {...register('windSpeed', { required: true })}
              type="number"
              isInvalid={!!errors.windSpeed}
            />
          </Form.Group>
        </Col>
      </Row>

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
          {...register('igcFile')}
          isInvalid={!!errors.igcFile}
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
