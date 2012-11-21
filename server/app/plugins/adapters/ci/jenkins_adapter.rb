require 'open-uri'
require 'nokogiri'
require 'model/runtime_info'

module Jashboard
  module CIServer
    class JenkinsAdapter
      def fetch_build_info(settings)
        @base_url = "http://#{settings.hostname}:#{settings.port}/job/#{settings.build_id}"
        @doc = Nokogiri::XML(open("#{@base_url}/lastSuccessfulBuild/api/xml"))
        Runtime::BuildRuntimeInfo.new(get_time, get_duration, get_result, get_current_status)
      end

      private

      def get_time
        seconds = @doc.at_css("timestamp").
                  text.
                  to_i / 1000
        Time.at(seconds).strftime("%d-%m-%Y %H:%M:%S")
      end

      def get_duration
        @doc.at_css("duration").
          text.
          to_i / 1000
      end

      def get_result
        @doc.at_css("result").text == "SUCCESS"
      end

      def get_current_status
        last_build_number = @doc.at_css("number").text.to_i
        status = nil
        begin
          open("#{@base_url}/#{last_build_number + 1}/api/xml")
          status = 1
        rescue OpenURI::HTTPError => error
          status = 0 if error.message.start_with? "404"
        rescue
        end
        status
      end
    end
  end
end
