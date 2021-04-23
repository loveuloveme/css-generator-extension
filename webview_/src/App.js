import './App.scss';
import './base/scroll-bar.scss';
import { useState, useEffect, useRef } from 'react';
import { ChromePicker } from 'react-color'

import TypeSelector from './components/TypeSelector';
import RangeController from './components/RangeController';
import PointInf from './components/PointInf';


function App({vscode}) {
    const [type, setType] = useState(0);
    const [angle, setAngle] = useState(0);

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
                a: '1'
            }, 
            {
                color: '#323232',
                x: 100,
                r: '255',
                g: '255',
                b: '255',
                a: '1'
            }, 
        ]
    );


    useEffect(() => {
        try{
            let generatedFunction = generateFunction();
            vscode.postMessage({
                command: 'css-code',
                text: `background: -moz-${generatedFunction};\r\nbackground: -webkit-${generatedFunction};\r\nbackground: ${generatedFunction};`
            });
        }catch(e){

        }
        console.log(generateFunction());
    }, [values, angle, type]);

    let changeColor = (index, value) => {
        let colorValues = [...values];
        colorValues[index] = value;

        setValues(colorValues);
    };

    let removeValue = (index) => {
        let colorValues = [...values];
        colorValues.splice(index, 1);

        setValues(colorValues);
    }

    let generateFunction = () => {
        return `${type == 0 ? 'linear' : 'radial'}-gradient(${type == 0 ? `${angle}deg` : 'circle'} ,${values.map(item => `rgba(${item.r}, ${item.g}, ${item.b}, ${item.a}) ${item.x}%`)})`;
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
                <div
                    className="bg-preview-content"
                    style={{
                        background: generateFunction()
                    }}
                >
                </div>
                <TypeSelector type={type} setType={setType} />
            </div>
            <div className="control">
                <RangeController values={values} setValues={setValues} angle={angle} setAngle={setAngle}/>
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
                                removeAction={() => removeValue(index)}
                                changeValue={value => {
                                    changeColor(index, value);
                                }}
                                removeEnabled={values.length > 2}
                                index={index}
                                key={index}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
