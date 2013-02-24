Before do
  @db_helper = Jashboard::FSDBHelper.new("db/#{ENV['JASHBOARD_ENV']}")
  @db_helper.clean_data
end

Before('@use_stub_server') do
  @fake_server = Jashboard::FakeServer.new
end

After('@use_stub_server') do
  @fake_server.stop
end
