import './index.scss';
import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';

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
    let handleChange = data => {
        let colorValues = [...values];

        colorValues.forEach((item, index) => {
            item.x = data[index];
        })

        setValues(colorValues);
    }

    let addPoint = () => {
        let colorValues = [...values];

        colorValues.push({...initialValue});

        colorValues.sort(function(a, b) {
            return a.x - b.x;
        });

        setValues(colorValues);
    };


    return(
        <div className="slider-wrapper section">

            <div className={"section-title" + (type === 1 ? ' disabled': '')}>
                Angle
            </div>
            <div className={"slider-wrapper-angle" + (type === 1 ? ' disabled': '')}>
                <Slider 
                    railStyle={{backgroundColor: '#323232'}}
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
            <Range
                value={values.map(item => item.x)}
                onChange={handleChange}
                allowCross={false}
                step={1}
                pushable={1}
                min={0}
                max={100}

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

                railStyle={{ backgroundColor: '#323232'}}
            />

            <div
                className="slider-add"
                onClick={addPoint}
            >
                Add Point
            </div>
        </div>
    );
}

export default RangeController;