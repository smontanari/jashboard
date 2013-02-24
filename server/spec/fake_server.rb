require 'webrick'

module Jashboard
  class FakeServer
    def initialize
      @server = WEBrick::HTTPServer.new :Port => 8000
    end
    
    def add_handler(url, response_fixture)
      @server.mount_proc url do |request, response|
        response.status = 200
        response['Content-Type'] = 'text/xml'
        response.body = File.new(File.join(File.dirname(__FILE__), "resources/#{response_fixture}.xml"))
      end
    end

    def start
      @server_thread = Thread.start do
        @server.start
      end
    end

    def stop
        @server.shutdown
        @server_thread.exit
    end
  end
end