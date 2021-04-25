import './index.scss';

function Input({name, width = 100, className = '', style, inputStyle, handleChange, value}){
    return(
        <div
            style={{
                width: width,
                ...style
            }}
            className={"input "+className}
        >
            <div className="input-name">{name}</div>
            <input type="text" name="" value={value} onChange={handleChange} style={inputStyle}/>
        </div>
    );
}

export default Input;