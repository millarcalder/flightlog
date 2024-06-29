import { useState, FC, InputHTMLAttributes } from 'react'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

const WindInput: FC<IProps> = (props) => {
  const [windDir, setWindDir] = useState(0)
  const [windSpeed, setWindSpeed] = useState(0)

  return (
    <>
      <input
        {...props}
        type="range"
        min={0}
        max={360}
        defaultValue={0}
        onChange={(e) => {
          setWindDir(parseInt(e.target.value))
          if (props.onChange) props.onChange(e)
        }}
      />
      <span>{windDir}°</span>
      <br />
      <svg
        width={200}
        height={200}
        viewBox="0 0 240 240"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          r={117.5}
          cx={120}
          cy={120}
          style={{ fill: 'none', stroke: 'gray', strokeWidth: 0.5 }}
        />
        <g
          transform-origin="20 115"
          transform={`translate(100 5) rotate(${windDir + 180})`}
        >
          <path
            style={{ fill: '#bf4141', stroke: 'black' }}
            d="m 10 0 l 20 0 l 2.5 25 l -25 0 Z"
          />
          <path
            style={{ fill: '#ffffff', stroke: 'black' }}
            d="m 7.5 25 l 25 0 l 2.5 25 l -30 0 Z"
          />
          <path
            style={{ fill: '#bf4141', stroke: 'black' }}
            d="m 5 50 l 30 0 l 2.5 25 l -35 0 Z"
          />
          <path
            style={{ fill: '#ffffff', stroke: 'black' }}
            d="m 2.5 75 l 35 0 l 2.5 25 l -40 0 Z"
          />
          <circle r={5} cx={20} cy={115} style={{ fill: 'black' }} />
          <line x1={20} y1={115} x2={0} y2={100} style={{ stroke: 'black' }} />
          <line x1={20} y1={115} x2={40} y2={100} style={{ stroke: 'black' }} />
        </g>
      </svg>
    </>
  )
}

export default WindInput
