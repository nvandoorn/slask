import React from 'react'
import InputMoment from 'input-moment'

import { datePicker } from './datepicker.css'

const DatePicker = props =>
  <div className={datePicker}>
    <InputMoment moment={props.moment} />
  </div>

export default DatePicker