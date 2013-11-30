http_path = '/'
css_dir = 'public/css'
sass_dir = 'public/sass'
images_dir = 'public/img'
fonts_dir = 'public/fonts'
javascripts_dir = 'routes'
relative_assets= true
line_comments = false

require 'autoprefixer-rails'
require 'csso'

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    io << Csso.optimize( AutoprefixerRails.compile(css) )
  end
end