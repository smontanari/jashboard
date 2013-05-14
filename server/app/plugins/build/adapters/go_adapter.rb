require 'open-uri'
require 'nokogiri'
require 'plugins/build/build_runtime_info'

module Jashboard
  module Plugin
    module Build
      module GoAdapter
        def get_go_runtime_info(configuration)
          adapter = GoAdapter.new(configuration)
          job = adapter.get_last_job
          status = adapter.get_current_status
          BuildRuntimeInfo.new(job.time.to_s, job.duration, job.success, status)
        end

        class GoAdapter
          def initialize(configuration)
            @pipeline_name = configuration.pipeline
            @stage_name = configuration.stage
            @job_name = configuration.job
            base_url = "http://#{configuration.hostname}:#{configuration.port}/go/api/pipelines"
            @pipeline_feed_doc = get_root_document("#{base_url}/#{configuration.pipeline}/stages.xml")
          end

          def get_last_job
            job_doc = get_job_doc(get_last_stage_doc)
            Struct.new(:time, :duration, :success).new(
              Time.parse(job_doc.css("property[name^='cruise_timestamp'][name$='completed']").text),
              job_doc.css("property[name='cruise_job_duration']").text.to_i,
              job_doc.css("result").text == "Passed"
            )
          end

          def get_current_status
            status = 0
            pipeline_url = @pipeline_feed_doc.xpath("entry/link[@title='#{@pipeline_name} Pipeline Detail' and @type='application/vnd.go+xml']")
            pipeline_doc = get_root_document(pipeline_url.attribute("href").text)
            stages = pipeline_doc.css("stage").map do |element|
              get_root_document(element.attribute("href").text)
            end
            stage_doc = stages.find {|doc| doc.attribute("name").text == @stage_name}
            job_doc = get_job_doc(stage_doc)
            status = 1 if job_doc.css("state").text == "Building"
            status
          end

          private

          def get_last_stage_doc
            last_stage_entry = @pipeline_feed_doc.xpath("entry/link[@title='#{@stage_name} Stage Detail' and @type='application/vnd.go+xml']")
            get_root_document(last_stage_entry.attribute("href").text)
          end

          def get_job_doc(stage_doc)
            jobs = stage_doc.css("job").map do |element| 
              get_root_document(element.attribute("href").text)
            end
            jobs.find {|doc| doc.attribute("name").text == @job_name}
          end

          def get_root_document(url)
            doc = Nokogiri::XML(open(url)).remove_namespaces!;
            doc.root
          end
        end
      end
    end
  end
end
