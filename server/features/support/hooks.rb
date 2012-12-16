Before do
  @db_helper = Jashboard::FSDBHelper.new("db/#{ENV['JASHBOARD_ENV']}")
  @db_helper.clean_data
end