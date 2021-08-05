import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import classes2 from './SliderFilter.module.css';

const useStyles = makeStyles((theme) => ({
    root: {
      width: 250 + theme.spacing(3) * 2,
    },
    margin: {
      height: theme.spacing(3),
    },
  }));

function valuetext(value) {
	return `${value}°C`;
}

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';


const IOSSlider = withStyles({
    root: {
      color: '#3880ff',
      height: 2,
      padding: '15px 0',
    },
    thumb: {
      height: 36,
      width: 36,
      backgroundColor: '#fff',
      boxShadow: iOSBoxShadow,
      marginTop: -18,
      marginLeft: -18,
      '&:focus, &:hover, &$active': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
    },
    active: {},
    valueLabel: {
      left: 2,
      top: 12,
      '& *': {
        background: 'transparent',
        color: '#000',
      },
    },
    track: {
      height: 2,
    },
    rail: {
      height: 2,
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
    mark: {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 1,
      marginTop: -3,
    },
    markActive: {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  })(Slider);

export default function RangeSlider(props) {
	const { category, label, range } = props.info;
	const classes = useStyles();
	// const [ value, setValue ] = React.useState([ range[0], range[1] ]);

    const handleChange = (event, newValue) => {
        //i.e. [{time: [0,300]},{calories: [0,5000]}]
		props.setRangedFilters((prev) => {
			const newArray = [ ...prev ];

			for (let obj of newArray) {
				if (category in obj) {
					obj[category] = newValue;
				}
			}
			return newArray;
        });
        props.setSelRanCat(category)
	};
 

	return (
		<div className={classes2.sliderContainer} key={category}>
			<div className={`${classes.root}`}>
                <Typography align='center' id="range-slider" gutterBottom>
                    {/* {label} */}
					<label className={classes2.label} htmlFor="">{label}</label>
				</Typography>
				<IOSSlider
					min={range[0]}
					max={range[1]}
					value={props.currentRange}
					onChange={handleChange}
					aria-labelledby="range-slider"
					getAriaValueText={valuetext}
                    valueLabelDisplay="on"
                    
				/>
			</div>
		</div>
	);
}

