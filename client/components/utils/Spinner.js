import React from 'react'

const Spinner = (props) => {
    const { spinnerSize } = props;
    console.log(spinnerSize);
    return (
        <>
            {spinnerSize === 'small' && (
                <>
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Wait...</span>
                </>
            )}
            {spinnerSize === 'large' && (
                <>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-grow text-primary m-md-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

export default Spinner