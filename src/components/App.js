import React, {Component} from 'react';
import axios from 'axios'; 

import Modal from './modal/modal';

class App extends Component{ 

	constructor(props) {
		super(props);
		this.state = {
			movieList: null,
			selectedMovieInfor: null,
			isOpenDialgo: false,
			searchTitle: ''
		};
		this.onSearchValue = this.onSearchValue.bind(this);
	}

	componentDidMount() {  
		this.onSearchValue();
	}  

	setMovieList(data){
		this.setState({movieList : data}); 
	}

	onOpenDialog(val, movie = []){
		this.setState({isOpenDialgo: val, selectedMovieInfor: movie})
	}

	onSearchValue(e = null){
		
		if(e){
			let query = e.target.value;  
			this.getMovieApi('/search/movie', {
				query, api_key: process.env.REACT_APP_MOVIE_DB_API_KEY
			}); 
		}else{ 
			this.getMovieApi('/discover/movie', {
				api_key: process.env.REACT_APP_MOVIE_DB_API_KEY,
				primary_release_year: 2021,
				sort_by: "popularity.desc"
			});
		} 
	} 

	getMovieApi(url, params){
		let self = this;
		axios.get(`https://api.themoviedb.org/3` + url, {
				params: params
			})
			.then(res => { 
				const data = res.data;  
				self.setMovieList(data.results);
			})
	}
	
	render() { 
		if(this.state.movieList){
			const moviePanels = this.state.movieList.map(movie => (
				<>
				<div className="movie-panel" key={movie.id} onClick={() => this.onOpenDialog(this.state.isOpenDialgo ? false : true , movie)}> 
					<div className="movie-panel-image">
						<div className="vote-num">{movie.vote_average}</div>
						<img className="image-thumb" src={process.env.REACT_APP_API_BASE_IMAGE_URL + movie.backdrop_path} />
					</div>
					<div className="movie-panel-title">
					  <div onClick={() => this.onOpenDialog(this.state.isOpenDialgo ? false : true , movie)}>
					  	{movie.title}
					  </div> 
					</div>  
				</div> 
				</>
			  )); 

			return (
				<div className="timescale-movie-container">
					<div className="timescale-header">
						<div>Timescale</div>
						<div className="search">
							<i className="search-icon"></i>
							<input
								className="input"
								onChange={e => this.onSearchValue(e)}
							/>
						</div>
					</div> 
					<div className='grid-content'> 
						{moviePanels} 
					</div>
					{
						this.state.isOpenDialgo ? 
							<Modal title={this.state.selectedMovieInfor.title}  onClose={()=> this.onOpenDialog(false)} show={this.state.isOpenDialgo} >
								<div className="modal-img">
									<img className="image-thumb" src={process.env.REACT_APP_API_BASE_IMAGE_URL + movie.backdrop_path} />
								</div>
								<div>
									<h3>Relase Date: {this.state.selectedMovieInfor.release_date}</h3>
									<p>{this.state.selectedMovieInfor.overview}</p>
									<h3>
										{this.state.selectedMovieInfor.popularity} / {this.state.selectedMovieInfor.vote_average} 
										({this.state.selectedMovieInfor.vote_count} total votes)  </h3>
								</div>

								
							</Modal> 
						: ""
					}
				</div>  
			);	 
		}
		return (
		<div className="timescale-movie-container">
			<div className="timescale-header">
				<div>Timescale</div>
				<div className="search">
					<i className="search-icon"></i>
					<input
						className="input"
						value={this.state.searchTitle}
						onChange={e => this.onSearchValue(e)}
					/>
				</div>
			</div> 
			<div className='grid-container'>
				<div className="grid-content">
					There is nothing.
				</div> 
			</div>
		</div>
		);  
	}
}

export default App;
