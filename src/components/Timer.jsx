import { useState, useEffect, useRef, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import useSound from 'use-sound';
import 'react-circular-progressbar/dist/styles.css';
import { Button, Box, Typography } from '@mui/material';
import { Pause, PlayCircle } from '@mui/icons-material';
import SettingsContext from '../SettingsContext.js';
import bellSound from '../assets/hand-bells-a-single.wav';
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

	const [changeSound] = useSound(bellSound);

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
			changeSound();
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
			<Typography sx={{ color: '#fffff' }} mt={4} variant="h2">
				{mode}
			</Typography>
			<CircularProgressbar
				value={percentage}
				text={minutes + ':' + seconds}
				styles={buildStyles({
					textColor: '#fffff',
					pathColor: mode === 'focus' ? focusColor : pauseColor,
					tailColor: 'rgba(255,255,255,0.2)',
				})}
			/>

			<div className="controls">
				<Button
					size="large"
					variant="outlined"
					onClick={() => {
						setPaused(false);
						pausedRef.current = false;
					}}
				>
					<PlayCircle />
				</Button>
				<Button
					size="medium"
					color="error"
					variant="outlined"
					onClick={() => {
						setPaused(true);
						pausedRef.current = true;
					}}
				>
					<Pause />
				</Button>
				<Button
					size="medium"
					variant="outlined"
					onClick={() => {
						setPaused(true);
						pausedRef.current = true;
						setMode('focus');
						modeRef.current = 'focus';
						setSecondsLeft(settings.focusMinutes * 60);
						secondsLeftRef.current = settings.focusMinutes * 60;
					}}
				>
					Reset
				</Button>
			</div>
		</div>
	);
}

export default Timer;
