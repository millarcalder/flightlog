import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faCircleCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import StandardModal, { StandardModalProps } from './StandardModal'
import { useAppSelector } from '../store/hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export const CopyUrlButton = () => {
  return (
    <Button
      variant="dark-link"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
      }}
    >
      <FontAwesomeIcon icon={faCopy} style={{ marginRight: 10 }} />
      {window.location.href}
    </Button>
  )
}

const CopyUrlWithSuccessSplash = () => {
  const [show, setShow] = useState<boolean>(true)

  return (
    <>
      <div
        style={{
          backgroundColor: 'rgba(0, 255, 0, 0.25)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: show ? 'none' : 'visibility 0s 2s, opacity 1s linear',
          visibility: show ? 'visible' : 'hidden',
          opacity: show ? 1 : 0
        }}
      >
        <FontAwesomeIcon
          icon={faCircleCheck}
          size="3x"
          color="green"
          bounce
          style={{ animationIterationCount: 1 }}
          onAnimationEnd={() => setShow(false)}
        />
      </div>
      <div
        style={{
          transition: 'opacity 1s linear',
          opacity: !show ? 1 : 0
        }}
      >
        <CopyUrlButton />
      </div>
    </>
  )
}

type FormValues = {
  s3ObjectName: string
}

const UploadIgcFileModal = (props: StandardModalProps) => {
  const navigate = useNavigate()
  const flightlogFile = useAppSelector((state) => state.main.flightlogFile)
  const validationSchema = yup.object({
    s3ObjectName: yup
      .string()
      .matches(/^[a-zA-Z_]{5,}$/)
      .required()
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    return new Promise((resolve) => {
      const encoder = new TextEncoder()
      const formdata = new FormData()
      const blob = new Blob([encoder.encode(flightlogFile)])
      formdata.append('igc', blob)
      fetch(
        `${process.env.REACT_APP_FLIGHTLOG_API_URL}upload-igc/s3/${data.s3ObjectName}`,
        {
          method: 'POST',
          body: formdata
        }
      )
        .then(() => {
          navigate(`/${data.s3ObjectName}`)
        })
        .catch(() => {
          setError('s3ObjectName', {
            type: 'server',
            message: 'Server Error'
          })
        })
        .finally(() => {
          resolve(true)
        })
    })
  }

  return (
    <StandardModal
      title="Upload"
      {...props}
      bodyStyle={{
        padding: 0,
        minHeight: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isSubmitting ? (
        <FontAwesomeIcon icon={faSpinner} size="3x" spin />
      ) : isSubmitSuccessful ? (
        <CopyUrlWithSuccessSplash />
      ) : flightlogFile ? (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <InputGroup style={{ padding: 10 }}>
            <Form.Control
              type="text"
              placeholder="File Name (a-z, A-Z, _)"
              {...register('s3ObjectName')}
            />
            <Button
              variant="outline-primary"
              disabled={!!errors.s3ObjectName}
              type="submit"
            >
              Submit
            </Button>
          </InputGroup>
        </form>
      ) : (
        <>Error</>
      )}
    </StandardModal>
  )
}

export const ShareModal = (props: StandardModalProps) => {
  return (
    <StandardModal
      title="Share"
      {...props}
      bodyStyle={{
        padding: 0,
        minHeight: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CopyUrlButton />
    </StandardModal>
  )
}

export default UploadIgcFileModal
