require 'open-uri'
require 'nokogiri'
require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module Build
      module JenkinsAdapter
        def get_jenkins_runtime_info(configuration)
          adapter = JenkinsAdapter.new(configuration)
          BuildRuntimeInfo.new(adapter.get_time, adapter.get_duration, adapter.get_result, adapter.get_current_status)
        end

        class JenkinsAdapter
          def initialize(configuration)
            @base_url = "http://#{configuration.hostname}:#{configuration.port}/job/#{configuration.build_id}"
            @doc = Nokogiri::XML(open("#{@base_url}/lastCompletedBuild/api/xml"))
          end

          def get_time
            seconds = @doc.css("timestamp").
                      text.
                      to_i / 1000
            Time.at(seconds).to_s
          end

          def get_duration
            @doc.css("duration").
              text.
              to_i / 1000
          end

          def get_result
            @doc.css("result").text == "SUCCESS"
          end

          def get_current_status
            completed_build_number = @doc.at_css("number").text.to_i
            status = nil
            begin
              doc = Nokogiri::XML(open("#{@base_url}/api/xml"))
              last_build_number = doc.css("lastBuild > number").text.to_i
              status = completed_build_number == last_build_number ? 0 : 1
            rescue OpenURI::HTTPError => e
            end
            status
          end
        end
      end
    end
  end
end
