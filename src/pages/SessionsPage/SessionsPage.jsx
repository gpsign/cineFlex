import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SessionsPage() {
	const id = useParams().id;

	const [schedules, setSchedules] = useState([]);

	useEffect(() => {
		axios
			.get(
				`https://mock-api.driven.com.br/api/v8/cineflex/movies/${id}/showtimes`
			)
			.then((sessions) => {
				setSchedules(sessions.data);
			})
			.catch((response) => console.log(response.status));
	}, []);

	return (
		<PageContainer>
			Selecione o horário
			<div>
				{schedules.days ? (
					schedules.days.map((session) => {
						return (
							<SessionContainer
								day={session.weekday}
								date={session.date}
								showTimes={session.showtimes}
								key={session.id}
							/>
						);
					})
				) : (
					<h1>Carregando</h1>
				)}
			</div>
			<FooterContainer data-test="footer">
				<div>
					<img src={schedules.posterURL} />
				</div>
				<div>
					<p>{schedules.title}</p>
				</div>
			</FooterContainer>
		</PageContainer>
	);
}

function SessionContainer({ day, date, showTimes }) {
	const navigate = useNavigate();
	return (
		<SessionContainerDiv data-test="movie-day">
			{day} - {date}
			<ButtonsContainer>
				{showTimes.map((hours) => {
					return (
						<button
							data-test="showtime"
							key={hours.id}
							onClick={() => navigate(`/assentos/${hours.id}`)}
						>
							{hours.name}
						</button>
					);
				})}
			</ButtonsContainer>
		</SessionContainerDiv>
	);
}

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-family: "Roboto";
	font-size: 24px;
	text-align: center;
	color: #293845;
	margin-top: 30px;
	padding-bottom: 120px;
	padding-top: 70px;
	div {
		margin-top: 20px;
	}
`;
const SessionContainerDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-family: "Roboto";
	font-size: 20px;
	color: #293845;
	padding: 0 20px;
`;
const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	margin: 20px 0;
	button {
		margin-right: 20px;
	}
	a {
		text-decoration: none;
	}
`;
const FooterContainer = styled.div`
	width: 100%;
	height: 120px;
	background-color: #c3cfd9;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 20px;
	position: fixed;
	bottom: 0;

	div:nth-child(1) {
		box-shadow: 0px 2px 4px 2px #0000001a;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		margin: 12px;
		img {
			width: 50px;
			height: 70px;
			padding: 8px;
		}
	}

	div:nth-child(2) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		p {
			text-align: left;
			&:nth-child(2) {
				margin-top: 10px;
			}
		}
	}
`;
