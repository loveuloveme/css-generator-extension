import './index.scss';
import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import { useState } from 'react';

const { Range } = Slider;

const initialValue = {
    color: '#fff',
    x: 50,
    r: '255',
    g: '255',
    b: '255',
    a: '1'
};

function RangeController({values, setValues, angle, setAngle, type}){
    const [isRangeSelect, setIsRangeSelect] = useState(false);

    let handleChange = data => {
        let colorValues = [...values];

        colorValues.forEach((item, index) => {
            item.x = data[index];
        })

        setValues(colorValues);
    }

    let addPoint = (x1, x2) => {
        let colorValues = [...values];

        colorValues.push({...initialValue});
        colorValues[colorValues.length - 1].x = Math.floor((x1+x2)/2);
        colorValues.sort(function(a, b) {
            return a.x - b.x;
        });

        setValues(colorValues);
        setIsRangeSelect(false);
    };

    return(
        <div className="slider-wrapper section">

            <div className={"section-title" + (type === 1 ? ' disabled': '')}>
                Angle
            </div>
            <div className={"slider-wrapper-angle" + (type === 1 ? ' disabled': '')}>
                <Slider
                    className="angle-slider" 
                    railStyle={{backgroundColor: '#828282'}}
                    trackStyle={{backgroundColor: '#fff'}}
                    handleStyle={{
                        border: 'none',
                        boxShadow: 'none'
                    }}
                    value={angle}
                    onChange={setAngle}
                    min={0}
                    max={360}
                    disabled={type === 1}
                />
                <div className="angle">
                    {angle}<span>deg</span>
                </div>
            </div>

            <div className="section-title">
                Range
            </div>

            {!isRangeSelect && 
                <Range
                    value={values.map(item => item.x)}
                    onChange={handleChange}
                    allowCross={false}
                    step={1}
                    pushable={1}
                    min={0}
                    max={100}
                    className="range-slider"

                    // activeDotStyle={{
                    //     backgroundColor: 'red'
                    // }}

                    trackStyle={values.map((item, index) => {
                        if(index < values.length - 1){
                            return {
                                background: `linear-gradient(90deg, ${item.color} 0%, ${values[index + 1].color} 100%)`,
                            }
                        }
                    })}

                    handleStyle={values.map(item => {
                        return {
                            backgroundColor: `rgba(${item.r}, ${item.g}, ${item.b}, ${item.a})`,
                            border: 'none',
                            boxShadow: 'none'
                        }
                    })}

                    railStyle={{ backgroundColor: '#828282'}}
                />
            }

            {isRangeSelect && 
                <div className="range-selector-wrapper">
                    <div
                        className="range-selector-wrapper-cancel"
                        onClick={() => setIsRangeSelect(false)}
                    >cancel</div>
                    <div className="range-selector">
                        {values.map((item, index) => {
                            if(index < values.length - 1){
                                return <>
                                    {index == 0 &&
                                        <div
                                            style={{
                                                background: `#fff`,
                                                width: `${values[0].x}%`
                                            }}
                                            className="range-selector-item"
                                            onClick={() => addPoint(0, values[0].x)}
                                        ></div>
                                    }
                                    {index != 0 && index != values.length - 1 && <div className="range-selector-separator"></div>}
                                    <div
                                        style={{
                                            background: `linear-gradient(90deg, ${item.color} 0%, ${values[index + 1].color} 100%)`,
                                            width: `${values[index + 1].x-item.x}%`
                                        }}
                                        className="range-selector-item"
                                        onClick={() => addPoint(item.x, values[index + 1].x)}
                                    ></div>
                                </>
                            }else{
                                return <div
                                    style={{
                                        background: `#fff`,
                                        width: `${100 - values[values.length - 1].x}%`
                                    }}
                                    className="range-selector-item"
                                    onClick={() => addPoint(values[values.length - 1].x, 100)}
                                ></div>
                            }

                        })}
                    </div>
                    <div className="range-selector-wrapper-info">Choose range</div>
                </div>
            }

            {!isRangeSelect && 
                <div
                    className="slider-add"
                    onClick={() => setIsRangeSelect(true)}
                >
                    Add Point
                </div>
            }
        </div>
    );
}

export default RangeController;