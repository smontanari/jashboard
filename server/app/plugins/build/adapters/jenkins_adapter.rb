require 'open-uri'
require 'nokogiri'
require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module Build
      module JenkinsAdapter
        def get_jenkins_runtime_info(configuration)
          @base_url = "http://#{configuration.hostname}:#{configuration.port}/job/#{configuration.build_id}"
          @doc = Nokogiri::XML(open("#{@base_url}/lastCompletedBuild/api/xml"))
          BuildRuntimeInfo.new(get_time, get_duration, get_result, get_current_status)
        end

        private

        def get_time
          seconds = @doc.at_css("timestamp").
                    text.
                    to_i / 1000
          Time.at(seconds).strftime("%Y-%m-%d %H:%M:%S %z")
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
          completed_build_number = @doc.at_css("number").text.to_i
          status = nil
          begin
            doc = Nokogiri::XML(open("#{@base_url}/api/xml"))
            last_build_number = doc.at_css("lastBuild > number").text.to_i
            status = completed_build_number == last_build_number ? 0 : 1
          rescue
          end
          status
        end
      end
    end
  end
end
