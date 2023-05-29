import axios from "axios";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
	const [movieList, setMovieList] = useState([]);

	useEffect(() => {
		axios
			.get(`https://mock-api.driven.com.br/api/v8/cineflex/movies`)
			.then((list) => {
				setMovieList(list.data);
			})
			.catch((resp) => console.log(resp.status));
	}, []);
	return (
		<PageContainer>
			Selecione o filme
			<ListContainer>
				{movieList.map((movie) => (
					<Movie URL={movie.posterURL} id={movie.id} key={movie.id} />
				))}
			</ListContainer>
		</PageContainer>
	);
}

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-family: "Roboto";
	font-size: 24px;
	text-align: center;
	color: #293845;
	margin-top: 30px;
	padding-top: 70px;
`;
const ListContainer = styled.div`
	width: 330px;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	padding: 10px;
`;

function Movie({ URL, id }) {
	const navigate = useNavigate();
	return (
		<MovieContainer onClick={() => navigate(`/sessoes/${id}`)}>
			<img src={URL} />
		</MovieContainer>
	);
}

const MovieContainer = styled.div`
	width: 145px;
	height: 210px;
	box-shadow: 0px 2px 4px 2px #0000001a;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px;
	img {
		width: 130px;
		height: 190px;
	}
`;
