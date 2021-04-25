import './index.scss';
import Util from '../../util'
import {useEffect, useRef} from 'react';

function PointInf({value, changeValue, onClick, index, removeAction, removeEnabled}){
    const element = useRef();

    useEffect(() => {
        let _value = {...value};
        let rgb = Util.hexToRgb(value.color);
        _value.r = rgb.r;
        _value.g = rgb.g;
        _value.b = rgb.b;

        updateValue(_value);
    }, []);


    let updateValue = (_value) => {
        _value.color = Util.RgbAToHex(`rgb(${parseInt(_value.r) || 0}, ${parseInt(_value.g) || 0}, ${parseInt(_value.b) || 0})`);
        changeValue(_value);
    };

    return(
        <div
            className="point-inf"
        >
            <div className="point-inf-id">#{index}</div>
            <div className="point-inf-color">rgba({value.r}, {value.g}, {value.b}, {value.a/1})</div>
            <div className="point-inf-wrapper">
                <div
                    className="color"
                    ref={element}
                    onClick={() => onClick(element)}
                    style={{
                        backgroundColor: value.color
                    }}
                ></div>
                <div className="color-inf">
                    <div className="position">
                        {`${value.x}%`}
                    </div>
                </div>
            </div>
            <div
                onClick={removeEnabled ? removeAction : () => {}}
                className={"position-remove " + (!removeEnabled ? 'disabled' : '')}
            >
                remove
            </div>
        </div>
    );
}

export default PointInf;