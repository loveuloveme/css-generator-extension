import './App.scss';
import './base/scroll-bar.scss';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { ChromePicker } from 'react-color'

import Input from './components/Input';
import TypeSelector from './components/TypeSelector';
import Util from './util'

const { Range } = Slider;

const initialValue = {
    color: '#fff',
    x: 50,
    r: '255',
    g: '255',
    b: '255',
    a: '100'
};

function RangeContoller({values, setValues}){
    let handleChange = data => {
        let colorValues = [...values];

        colorValues.forEach((item, index) => {
            item.x = data[index];
        })

        setValues(colorValues);
    }

    let addPoint = () => {
        let colorValues = [...values];

        let mid = Math.floor(colorValues.length/2);

        colorValues.push({...initialValue});

        colorValues.sort(function(a, b) {
            return a.x - b.x;
        });

        setValues(colorValues);
    };

    return(
        <div className="slider-wrapper section">
            <div className="section-title">
                Range
            </div>
            <Range
                value={values.map(item => item.x)}

                onChange={handleChange}

                allowCross={false}
        
                step={1}

                trackStyle={values.map((item, index) => {
                    if(index < values.length - 1){
                        return {
                            background: `linear-gradient(90deg, ${item.color} 0%, ${values[index + 1].color} 100%)`,
                        }
                    }
                })}

                handleStyle={values.map(item => {
                    return {
                        backgroundColor: item.color
                    }
                })}

                //railStyle={{ backgroundColor: 'black', height: 10}}
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

function PointInf({value, changeValue, onClick}){
    const element = useRef();

    const [color, setColor] = useState({
        r: '241',
        g: '112',
        b: '19',
        a: '1',
      });

    useEffect(() => {
        let _value = {...value};
        let rgb = Util.hexToRgb(value.color);
        _value.r = rgb.r;
        _value.g = rgb.g;
        _value.b = rgb.b;

        updateValue(_value);
    }, []);

    let updateValue = (_value) => {
        console.log(`rgb(${parseInt(_value.r) || 0}, ${parseInt(_value.g) || 0}, ${parseInt(_value.b) || 0})`);
        _value.color = Util.RgbAToHex(`rgb(${parseInt(_value.r) || 0}, ${parseInt(_value.g) || 0}, ${parseInt(_value.b) || 0})`);
        changeValue(_value);
    };

    return(
        <div
            className="point-inf"
        >
            <div className="point-inf-wrapper">
                <div
                    className="color"
                    ref={element}
                    onClick={() => {
                        let rect = element.current.getBoundingClientRect();
                        onClick(rect.x + rect.width, rect.y - 250);
                    }}
                    style={{
                        backgroundColor: value.color
                    }}
                ></div>
                <div className="color-inf">
                    <div className="color-inf-input">
                        <Input name="HEX" className="hex" value={value.color} />
                        <div className="rgb">
                            <Input
                                name="r"
                                value={value.r || ''}
                                width={50}
                                handleChange={event => {
                                    console.log(event.target.value);
                                    if(!Util.isNumeric(event.target.value) && event.target.value != '') return;
                                    let _value = {...value};                                    
                                    _value.r = event.target.value;

                                    if(_value.r > 255) _value.r = 255;
                                    updateValue(_value);
                                }}
                                inputStyle={{
                                    //rgb(231, 76, 60)
                                    borderColor: `rgb(255, 69, 58)`
                                }}
                            />
                            <Input
                                name="g"
                                value={value.g || ''}
                                width={50}
                                handleChange={event => {
                                    console.log(event.target.value);
                                    if(!Util.isNumeric(event.target.value) && event.target.value != '') return;
                                    let _value = {...value};                                    
                                    _value.g = event.target.value;

                                    if(_value.g > 255) _value.g = 255;
                                    updateValue(_value);
                                }}
                                inputStyle={{
                                    //rgb(39, 174, 96)
                                    borderColor: `rgb(48, 209, 88)`
                                }}
                            />
                            <Input
                                name="b"
                                value={value.b || ''}
                                width={50}
                                handleChange={event => {
                                    console.log(event.target.value);
                                    if(!Util.isNumeric(event.target.value) && event.target.value != '') return;
                                    let _value = {...value};                                    
                                    _value.b = event.target.value;

                                    if(_value.b > 255) _value.b = 255;
                                    updateValue(_value);
                                }}
                                inputStyle={{
                                    //rgb(41, 128, 185)
                                    borderColor: `rgb(10, 132, 255)`
                                }}
                            />
                            <Input name="a" width={50} />
                        </div>
                        <div className="position">
                            <div className="position-pos">
                                {`${value.x}%`}
                            </div>
                            <div className="position-remove">
                                Удалить
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App({vscode}) {
    const [type, setType] = useState(0);

    const [colorPicker, setColorPicker] = useState({x: -1, y: -1});
    const [selectedValue, setSelectedValue] = useState(-1);

    const [values, setValues] = useState(
        [
            {
                color: '#fff',
                x: 50,
                r: '255',
                g: '255',
                b: '255',
                a: '100'
            }, 
            {
                color: '#323232',
                x: 100,
                r: '255',
                g: '255',
                b: '255',
                a: '100'
            }, 
        ]
    );


    useEffect(() => {
        // vscode.postMessage({
        //     command: 'alert',
        //     text: 'hehe'
        // });
    }, []);

    let changeColor = (index, value) => {
        let colorValues = [...values];
        colorValues[index] = value;

        setValues(colorValues);
    };

    let selectItem = (index) => {

    }

    return (
        <div className="App">
            <div 
                style={{
                    position: 'absolute',
                    zIndex: 100,
                    left: colorPicker.x,
                    top: colorPicker.y,
                }}
            >
                {selectedValue != -1 ?
                    <>
                        <div
                            style={{
                                position: 'fixed',
                                top: '0px',
                                right: '0px',
                                bottom: '0px',
                                left: '0px'
                            }}

                            onClick={() => setSelectedValue(-1)}
                        />
                        <ChromePicker
                            color={{
                                r: values[selectedValue].r,
                                g: values[selectedValue].g,
                                b: values[selectedValue].b,
                                a: values[selectedValue].a,
                            }}
                            onChange={(rgb) => {
                                let _value = {...values[selectedValue]};
                                _value.color = rgb.hex;
                                _value.r = rgb.rgb.r;
                                _value.g = rgb.rgb.g;
                                _value.b = rgb.rgb.b;
                                _value.a = rgb.rgb.a;

                                changeColor(selectedValue, _value);
                            }}
                        />
                    </>
                : null}
            </div>
            <div className="bg-preview">
                <div className="bg-preview-content">
                </div>
            </div>
            <div className="control">
                <TypeSelector type={type} setType={setType} />
                <RangeContoller values={values} setValues={setValues} />
                <div className="points section">
                <div className="section-title">Color Information</div>
                    <div className="points-wrapper">
                        {values.map((item, index) => 
                            <PointInf
                                value={item}
                                onClick={(x, y) => {
                                    setSelectedValue(index);
                                    setColorPicker({x, y});
                                }}
                                changeValue={value => {
                                    changeColor(index, value);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
