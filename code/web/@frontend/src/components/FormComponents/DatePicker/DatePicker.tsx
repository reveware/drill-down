import React from 'react';
import ReactDatePicker from 'react-datepicker';
import './DatePicker.scss';

interface DatePickerProps {
    date?: Date;
    onChange: (date: Date) => void;
    onBlur?: () => void;
}
export const DatePicker: React.FC<DatePickerProps> = (props) => {
    const { date, onChange, onBlur } = props;
    return (
        <div className='date-picker'>
            <ReactDatePicker closeOnScroll={true} selected={date} onBlur={onBlur} onChange={onChange} />
        </div>
    );
};
