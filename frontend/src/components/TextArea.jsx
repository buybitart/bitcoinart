import React, { forwardRef } from 'react'

const TextArea = forwardRef(({placeholder, className, autocomplete, id, defaultValue, onChange, name, ...rest}, ref) => {
  return (
    <>
      <textarea placeholder={placeholder} ref={ref} className={className} name={name} autoComplete={autocomplete} id={id} defaultValue={defaultValue} onChange={onChange} {...rest} />
    </>
  )
})

export default TextArea
