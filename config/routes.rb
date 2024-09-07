Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get '/', to: 'application#render_react', as: :root
  get '/create-account', to: 'application#render_react', as: :account
  get 'signup/*all', to: 'application#render_react', as: :signup
end
