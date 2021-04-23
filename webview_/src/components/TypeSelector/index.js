import './index.scss';

function TypeSelector({type, setType}){
    return(
        <div className="type">
            <div
                className={"type-item " + (type == 0 ? 'selected' : '')}
                onClick={() => setType(0)}
            >
                Linear
            </div>
            <div
                className={"type-item " + (type == 1 ? 'selected' : '')}
                onClick={() => setType(1)}
            >
                Radial
            </div>
        </div>
    );
}

export default TypeSelector;