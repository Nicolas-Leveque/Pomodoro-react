import { useState, useEffect, useRef, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button, Box, Typography } from '@mui/material';
import { Pause, PlayCircle } from '@mui/icons-material';
import SettingsContext from '../SettingsContext.js';
import './timer.css';

const focusColor = '#E53935'; //red
const pauseColor = '#43A047'; //green

function Timer() {
	const settings = useContext(SettingsContext);

	const [paused, setPaused] = useState(true);
	const [mode, setMode] = useState('focus');
	const [secondsLeft, setSecondsLeft] = useState(0);

	const pausedRef = useRef(paused);
	const modeRef = useRef(mode);
	const secondsLeftRef = useRef(secondsLeft);

	function chronometer() {
		secondsLeftRef.current--;
		setSecondsLeft(secondsLeftRef.current);
	}

	useEffect(() => {
		const switchMode = () => {
			const nextMode = modeRef.current === 'focus' ? 'pause' : 'focus';
			const nextSeconds =
				(nextMode === 'focus' ? settings.focusMinutes : settings.pauseMinutes) *
				60;
			setMode(nextMode);
			modeRef.current = nextMode;
			setSecondsLeft(nextSeconds);
			secondsLeftRef.current = nextSeconds;
		};
		secondsLeftRef.current = settings.focusMinutes * 60;
		setSecondsLeft(secondsLeftRef.current);

		const interval = setInterval(() => {
			if (pausedRef.current) {
				return;
			}
			if (secondsLeftRef.current === 0) {
				return switchMode();
			}
			chronometer();
		}, 1000);
		return () => clearInterval(interval);
	}, [settings]);

	const totalTimeSeconds =
		mode === 'focus' ? settings.focusMinutes * 60 : settings.pauseMinutes * 60;
	const percentage = Math.round(
		(secondsLeftRef.current / totalTimeSeconds) * 100
	);

	let minutes = Math.floor(secondsLeftRef.current / 60);
	let seconds = secondsLeftRef.current % 60;
	if (seconds < 10) seconds = '0' + seconds;

	return (
		<div className="timer">
			<CircularProgressbar
				value={percentage}
				text={minutes + ':' + seconds}
				styles={buildStyles({
					textColor: '#fff',
					pathColor: mode === 'focus' ? focusColor : pauseColor,
					tailColor: 'rgba(255,255,255,0.2)',
				})}
			/>
			<Typography mt={4}>{mode}</Typography>
			<div className="controls">
				<Button
					size='large'
					variant='outlined'
					onClick={() => {
						setPaused(false);
						pausedRef.current = false;
					}}
				>
					<PlayCircle />
				</Button>
				<Button
					size='medium'
					color='error'
					variant='outlined'
					onClick={() => {
						setPaused(true);
						pausedRef.current = true;
					}}
				>
					<Pause />
				</Button>
			</div>
		</div>
	);
}

export default Timer;
