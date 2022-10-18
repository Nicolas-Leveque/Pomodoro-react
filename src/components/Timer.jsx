import { useState, useEffect, useRef , useContext } from 'react';
import { Button, Box, Typography, Divider, CircularProgress } from "@mui/material";
import {Pause, PlayCircle} from '@mui/icons-material';
import SettingsContext from "../SettingsContext.js";
import './timer.css';

const focusColor = '#E53935';
const pauseColor = '#43A047';

function Timer() {
    const settings = useContext(SettingsContext)

    const [ paused, setPaused ] = useState(true);
    const [ mode, setMode ] = useState('focus');
    const [ secondsLeft, setSecondsLeft ] = useState(0);

    const pausedRef = useRef(paused);
    const modeRef = useRef(mode);
    const secondsLeftRef = useRef(secondsLeft);

    function chronometer() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    };

    useEffect(() => {
        const switchMode = () => {
            const nextMode = modeRef.current === 'focus' ? 'pause' : 'focus';
            const nextSeconds = ( nextMode === 'focus' ? settings.focusMinutes : settings.pauseMinutes ) * 60;
            //25 minutes focus, 5 minutes pause
            //I'm keeping the format 25 * 60 for when I implement a setting component to change the focus and pause times
            setMode(nextMode);
            modeRef.current = nextMode;
            setSecondsLeft(nextSeconds);
            secondsLeftRef.current = nextSeconds;
        };
        secondsLeftRef.current  = settings.focusMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);

        const interval = setInterval(() => {
            if (pausedRef.current) {
                return;
            };
            if ( secondsLeftRef.current === 0) {
                return switchMode();
            };
            chronometer();
        }, 1000);
        return () => clearInterval(interval);
    }, [settings])

    const totalTimeSeconds = mode === 'focus'
        ? 1500
        : 300;
    const percentage = Math.round(secondsLeftRef.current / totalTimeSeconds * 100);

    let minutes = Math.floor(secondsLeftRef.current / 60);
    let seconds = secondsLeftRef.current % 60;
    if ( seconds < 10) seconds = '0' + seconds;


    return (
        <div className='timer'>
                <Box sx={{ position: 'relative', display: 'inline-flex'}}>
                    <CircularProgress
                        variant='determinate'
                        value={percentage}
                        size={200}
                        thickness={2}

                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="caption" component="p" color="#fff" sx={{ fontSize: 'h3.fontSize'}}>
                            {`${minutes}:${seconds}`}
                        </Typography>
                    </Box>
                </Box>
            <Typography mt={4}>{mode}</Typography>
            <div className='controls'>

                <Button onClick={() => {
                        setPaused(false);
                        pausedRef.current = false;
                }}>
                    <PlayCircle />
                </Button>
                <Button onClick={() => {
                        setPaused(true);
                        pausedRef.current = true;
                }}>
                    <Pause />
                </Button>
            </div>
        </div>

    );
};

export default Timer;