import React from 'react'

const page = () => {
  return (
    <div>
        <form action="">
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
            </div>
            <div>
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirm-password" required />
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
  )
}

export default page