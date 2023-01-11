import { Slider, Modal, Box, Button, Typography } from '@mui/material';
import { useState, useContext } from 'react';
import SettingsContext from '../SettingsContext.js';
import './config.css';

function Config() {
	const [showSettings, setShowSettings] = useState(false);
	const handleOpen = () => setShowSettings(true);
	const handleClose = () => setShowSettings(false);
	const settings = useContext(SettingsContext);

	const changeFocusTime = (e) => {
		e.preventDefault();
		settings.setFocusMinutes(e.target.value);
	};

	const changePauseTime = (e) => {
		e.preventDefault();
		settings.setPauseMinutes(e.target.value);
	};
	return (
		<div>
			<Button onClick={handleOpen}>Configuration</Button>
			<Modal open={showSettings} onClose={handleClose}>
				<Box className="config-modal">
					<Typography sx={{ color: '#fffff' }}>Focus Time</Typography>
					<Slider
						size="medium"
						min={5}
						max={60}
						defaultValue={25}
						name="Focus Time"
						aria-label="Focus Time"
						onChange={changeFocusTime}
					/>
					<Typography sx={{ paddingBottom: 5, color: '#fffff' }}>
						{settings.focusMinutes}
					</Typography>

					<Typography sx={{ color: '#fffff' }}>Pause Time</Typography>
					<Slider
						size="medium"
						min={1}
						max={30}
						defaultValue={5}
						aria-label="Pause Time"
						onChange={changePauseTime}
					/>
					<Typography sx={{ color: '#fffff' }}>
						{settings.pauseMinutes}
					</Typography>
				</Box>
			</Modal>
		</div>
	);
}

export default Config;
